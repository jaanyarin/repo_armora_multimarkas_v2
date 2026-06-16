package com.armora.platform.api;

import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Provider
public class JsonExceptionMapper implements ExceptionMapper<WebApplicationException> {

    private static final Logger LOG = LoggerFactory.getLogger(JsonExceptionMapper.class);

    @Override
    public Response toResponse(WebApplicationException exception) {
        Response original = exception.getResponse();
        int status = original.getStatus();

        String message = exception.getMessage();
        if (message == null || message.isBlank()) {
            message = switch (status) {
                case 400 -> "Solicitud invalida";
                case 401 -> "No autorizado";
                case 403 -> "Acceso denegado";
                case 404 -> "Recurso no encontrado";
                case 409 -> "Conflicto";
                case 422 -> "Entidad no procesable";
                case 500 -> "Error interno del servidor";
                default -> "Error desconocido";
            };
        }

        String code = switch (status) {
            case 400 -> "BAD_REQUEST";
            case 401 -> "UNAUTHORIZED";
            case 403 -> "FORBIDDEN";
            case 404 -> "NOT_FOUND";
            case 409 -> "CONFLICT";
            case 422 -> "UNPROCESSABLE_ENTITY";
            case 500 -> "INTERNAL_ERROR";
            default -> "ERROR";
        };

        ResponseWrapper<Void> body = ResponseWrapper.error(code, message);

        return Response.status(status)
                .entity(body)
                .type(MediaType.APPLICATION_JSON)
                .build();
    }
}
