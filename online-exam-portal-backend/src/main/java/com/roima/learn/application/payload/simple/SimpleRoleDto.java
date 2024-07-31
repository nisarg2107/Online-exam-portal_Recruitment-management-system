package com.roima.learn.application.payload.simple;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
public class SimpleRoleDto {
    private int id;
    private String type;
}
