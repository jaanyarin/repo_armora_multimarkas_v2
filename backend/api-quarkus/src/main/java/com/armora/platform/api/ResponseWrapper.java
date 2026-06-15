package com.armora.platform.api;

import java.util.List;
import java.util.UUID;

public record ResponseWrapper<T>(
        T data,
        Meta meta,
        List<ErrorItem> errors
) {
    public record Meta(String requestId) {
        public Meta() {
            this(UUID.randomUUID().toString().substring(0, 8));
        }
    }

    public record ErrorItem(String code, String message, String field) {
        public ErrorItem(String code, String message) {
            this(code, message, null);
        }
    }

    public static <T> ResponseWrapper<T> ok(T data) {
        return new ResponseWrapper<>(data, new Meta(), null);
    }

    public static <T> ResponseWrapper<T> error(String code, String message) {
        return new ResponseWrapper<>(null, new Meta(), List.of(new ErrorItem(code, message)));
    }
}
