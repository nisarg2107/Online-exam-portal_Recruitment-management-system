package com.roima.learn.application.payload;

import com.roima.learn.application.payload.simple.SimpleOptionDto;
import com.roima.learn.application.payload.simple.SimpleQuestionDto;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
public class ImageDto {
    private int imageId;
    private String imageText;
    private String altText;
    private int imageOrder;

    private SimpleQuestionDto question;

    private SimpleOptionDto option;
}
