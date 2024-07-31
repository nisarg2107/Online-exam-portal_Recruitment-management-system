package com.roima.learn.application.payload;

import com.roima.learn.application.payload.simple.SimpleDifficultyDto;
import com.roima.learn.application.payload.simple.SimpleImageDto;
import com.roima.learn.application.payload.simple.SimpleOptionDto;
import lombok.*;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
public class QuestionDto {
    private int id;
    private String title;
    private String description;

    private CategoryDto category;

    private Set<SimpleImageDto> imageSet;

    // later --- might be finished
    private Set<SimpleOptionDto> optionSet;

    private SimpleDifficultyDto difficulty;

    // not completed rn.. --- might be completed
    private Set<ExamQuestionDto> examQuestionSet;

    private boolean mcq;
}
