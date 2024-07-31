package com.roima.learn.application.payload;

import com.roima.learn.application.payload.simple.SimpleQuestionDto;
import lombok.*;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
public class CategoryDto {
    private int id;
    private String type;
    private Set<SimpleQuestionDto> questionSet;
}
