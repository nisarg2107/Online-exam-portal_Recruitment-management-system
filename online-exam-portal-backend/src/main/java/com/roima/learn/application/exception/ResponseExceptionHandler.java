package com.roima.learn.application.exception;

import com.roima.learn.application.payload.response.ExceptionDto;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.NoSuchElementException;


@ControllerAdvice
public class ResponseExceptionHandler {
    @ExceptionHandler(value = NoSuchElementException.class)
    public ResponseEntity<ExceptionDto> exception(NoSuchElementException exception) {
        return new ResponseEntity<>(new ExceptionDto(exception.getMessage(),HttpStatus.NOT_FOUND.value(), false),HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = {AlreadyExistsException.class})
    public ResponseEntity<ExceptionDto> alreadyExistsException(AlreadyExistsException exception) {
        return new ResponseEntity<>(new ExceptionDto(exception.getMessage(),HttpStatus.FOUND.value(),  false),HttpStatus.FOUND);
    }
    @ExceptionHandler(value = {ExpiredJwtException.class})
    public ResponseEntity<ExceptionDto> handleExpiredJwtException(ExpiredJwtException ex) {
//        String requestUri = ((ServletWebRequest)request).getRequest().getRequestURI().toString();
//        ExceptionMessage exceptionMessage = new ExceptionMessage(ex.getMessage(), requestUri);
        return new ResponseEntity<>(new ExceptionDto(ex.getMessage(),HttpStatus.FORBIDDEN.value(),false), HttpStatus.FORBIDDEN);
    }
}
