package com.roima.learn.application.payload.simple;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
public class SimpleOptionDto {
    private int id;
    private String name;
//    private int imageId;
    private boolean correct;
}
