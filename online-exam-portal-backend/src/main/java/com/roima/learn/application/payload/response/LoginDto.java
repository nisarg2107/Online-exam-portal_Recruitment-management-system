package com.roima.learn.application.payload.response;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginDto {
    private String message;
    private String token;
//    private String role;
}
