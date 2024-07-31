package com.roima.learn.application.payload.simple;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
public class SimpleCategoryDto {
    private int id;
    private String type;
}
