package com.roima.learn.application.payload.simple;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
public class CategoryWithMarksDto {
    private int id;
    private String type;
    private int number;
    private int marks;
}
