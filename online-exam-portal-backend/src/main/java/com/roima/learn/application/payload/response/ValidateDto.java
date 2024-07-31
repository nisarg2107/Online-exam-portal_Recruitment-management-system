package com.roima.learn.application.payload.response;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ValidateDto {
    private int id;
    private String name;
    private String role;
    private boolean tokenValid;
}
