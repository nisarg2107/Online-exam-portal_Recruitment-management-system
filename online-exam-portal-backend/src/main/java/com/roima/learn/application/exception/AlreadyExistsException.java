package com.roima.learn.application.exception;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AlreadyExistsException extends Exception{
    private String message;
    public AlreadyExistsException (String message) {
        this.message = message;
    }
}
