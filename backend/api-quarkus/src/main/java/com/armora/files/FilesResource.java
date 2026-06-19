package com.armora.files;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.StreamingOutput;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import com.armora.platform.api.ResponseWrapper;

@Path("/files")
@Tag(name = "Files")
@RolesAllowed({"ADMINISTRADOR", "OPERADOR"})
public class FilesResource {

    @ConfigProperty(name = "app.upload.dir", defaultValue = "uploads/photos")
    String uploadsDir;

    // =========================================================================
    // DEBUG (solo dev)
    // =========================================================================

    @GET
    @Path("/debug")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(summary = "Debug: info del directorio de uploads", hidden = true)
    public ResponseWrapper<Map<String, Object>> debug() {
        java.nio.file.Path path = Paths.get(uploadsDir);
        Map<String, Object> info = new HashMap<>();
        info.put("uploadsDir", uploadsDir);
        info.put("absolutePath", path.toAbsolutePath().normalize().toString());
        info.put("exists", Files.exists(path));
        if (Files.exists(path)) {
            java.io.File[] files = path.toFile().listFiles();
            if (files != null) {
                List<Map<String, Object>> fileList = new ArrayList<>();
                for (java.io.File f : files) {
                    Map<String, Object> fi = new HashMap<>();
                    fi.put("name", f.getName());
                    fi.put("size", f.length());
                    fileList.add(fi);
                }
                info.put("files", fileList);
            }
        }
        return ResponseWrapper.ok(info);
    }

    // =========================================================================
    // UPLOAD
    // =========================================================================

    @POST
    @Path("/upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(summary = "Subir archivo (foto)")
    public ResponseWrapper<Map<String, Object>> upload(@RestForm("file") FileUpload file) {
        if (file == null || file.filePath() == null) {
            throw new WebApplicationException("No se envió ningún archivo", Response.Status.BAD_REQUEST);
        }

        String originalName = file.fileName();
        if (originalName == null || originalName.isBlank()) {
            throw new WebApplicationException("Nombre de archivo inválido", Response.Status.BAD_REQUEST);
        }

        // Validar extensión
        String ext = "";
        int dotIdx = originalName.lastIndexOf('.');
        if (dotIdx > 0) {
            ext = originalName.substring(dotIdx).toLowerCase();
        }
        if (!ext.equals(".jpg") && !ext.equals(".jpeg") && !ext.equals(".png") && !ext.equals(".gif") && !ext.equals(".webp")) {
            throw new WebApplicationException(
                "Formato no permitido. Use: .jpg, .jpeg, .png, .gif, .webp",
                Response.Status.BAD_REQUEST);
        }

        // Validar tamaño (max 5MB)
        try {
            long size = Files.size(file.filePath());
            if (size > 5 * 1024 * 1024) {
                throw new WebApplicationException("El archivo excede el tamaño máximo de 5MB", Response.Status.BAD_REQUEST);
            }
        } catch (IOException e) {
            throw new WebApplicationException("Error al leer el archivo", Response.Status.INTERNAL_SERVER_ERROR);
        }

        try {
            // Crear directorio si no existe
            java.nio.file.Path uploadPath = Paths.get(uploadsDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generar nombre único
            String storedName = UUID.randomUUID().toString() + ext;
            java.nio.file.Path targetPath = uploadPath.resolve(storedName);

            // Copiar archivo
            try (InputStream in = Files.newInputStream(file.filePath())) {
                Files.copy(in, targetPath, StandardCopyOption.REPLACE_EXISTING);
            }

            String url = "/files/photos/" + storedName;

            return ResponseWrapper.ok(Map.of(
                "url", url,
                "fileName", storedName,
                "originalName", originalName,
                "size", Files.size(targetPath)
            ));
        } catch (IOException e) {
            throw new WebApplicationException("Error al guardar el archivo: " + e.getMessage(),
                    Response.Status.INTERNAL_SERVER_ERROR);
        }
    }

    // =========================================================================
    // SERVE PHOTO (dev mode — en prod lo sirve Nginx)
    // =========================================================================

    @GET
    @Path("/photos/{fileName}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    @Operation(summary = "Servir foto (dev mode)")
    @PermitAll
    public Response servePhoto(@PathParam("fileName") String fileName) {
        if (fileName == null || fileName.isBlank() || fileName.contains("..") || fileName.contains("/") || fileName.contains("\\")) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Nombre de archivo inválido")
                    .build();
        }

        java.nio.file.Path uploadPath = Paths.get(uploadsDir);
        java.nio.file.Path filePath = uploadPath.resolve(fileName).normalize();

        if (!filePath.startsWith(uploadPath.normalize())) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Nombre de archivo inválido")
                    .build();
        }

        if (!Files.exists(filePath) || !Files.isReadable(filePath)) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Archivo no encontrado")
                    .build();
        }

        try {
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            long fileSize = Files.size(filePath);
            StreamingOutput stream = output -> {
                try (InputStream in = Files.newInputStream(filePath)) {
                    byte[] buffer = new byte[8192];
                    int bytesRead;
                    while ((bytesRead = in.read(buffer)) != -1) {
                        output.write(buffer, 0, bytesRead);
                    }
                }
            };

            return Response.ok(stream)
                    .type(contentType)
                    .header("Content-Length", fileSize)
                    .header("Cache-Control", "private, max-age=3600")
                    .build();
        } catch (IOException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al leer el archivo")
                    .build();
        }
    }

    // =========================================================================
    // DELETE PHOTO
    // =========================================================================

    @DELETE
    @Path("/photos/{fileName}")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(summary = "Eliminar archivo de foto")
    public ResponseWrapper<Map<String, Object>> deletePhoto(@PathParam("fileName") String fileName) {
        // Validar fileName (no contenga .. / \ )
        if (fileName == null || fileName.isBlank() || fileName.contains("..") || fileName.contains("/") || fileName.contains("\\")) {
            throw new WebApplicationException("Nombre de archivo inválido", Response.Status.BAD_REQUEST);
        }

        // Construir path y verificar que esté dentro del directorio de uploads
        java.nio.file.Path uploadPath = Paths.get(uploadsDir);
        java.nio.file.Path filePath = uploadPath.resolve(fileName).normalize();

        if (!filePath.startsWith(uploadPath.normalize())) {
            throw new WebApplicationException("Nombre de archivo inválido", Response.Status.BAD_REQUEST);
        }

        if (!Files.exists(filePath) || !Files.isReadable(filePath)) {
            throw new WebApplicationException("Archivo no encontrado", Response.Status.NOT_FOUND);
        }

        try {
            Files.delete(filePath);
            return ResponseWrapper.ok(Map.of(
                "deleted", true,
                "fileName", fileName
            ));
        } catch (IOException e) {
            throw new WebApplicationException("Error al eliminar el archivo: " + e.getMessage(),
                    Response.Status.INTERNAL_SERVER_ERROR);
        }
    }
}
