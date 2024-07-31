package com.roima.learn.application.payload.response;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExceptionDto {
    private String message;
    private int statusCode;
    private boolean success;
}
