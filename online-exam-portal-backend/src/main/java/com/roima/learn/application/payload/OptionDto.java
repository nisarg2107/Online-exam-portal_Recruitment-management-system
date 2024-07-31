package com.roima.learn.application.payload;

import com.roima.learn.application.payload.simple.SimpleImageDto;
import com.roima.learn.application.payload.simple.SimpleQuestionDto;
import lombok.*;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
public class OptionDto {
    private int id;
    private String name;
    private Set<SimpleImageDto> imageSet;

    private SimpleQuestionDto question;

    private boolean correct;
}
