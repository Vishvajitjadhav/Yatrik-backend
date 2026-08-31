package com.myprojects.YatrikApp.exception;

/**
 * Thrown when an authenticated user attempts to access a resource they do not own.
 * Mapped to HTTP 403 by {@code GlobalExceptionHandler}.
 */
public class UnAuthorisedException extends RuntimeException {
    public UnAuthorisedException(String message) {
        super(message);
    }
}
