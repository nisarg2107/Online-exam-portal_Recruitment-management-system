package com.roima.learn.application.payload.simple;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
public class SimpleImageDto {
    private int imageId;
    private String imageText;
    private String altText;
    private int imageOrder;
}
