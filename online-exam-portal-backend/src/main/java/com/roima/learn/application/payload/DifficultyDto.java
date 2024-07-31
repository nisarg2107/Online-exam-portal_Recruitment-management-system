package com.roima.learn.application.payload;

// this is incomplete ---- might be completed

import com.roima.learn.application.payload.simple.SimpleExamDto;
import com.roima.learn.application.payload.simple.SimpleQuestionDto;
import lombok.*;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
public class DifficultyDto {
    private int id;
    private String level;

//    make changes later --- might be completed
    private Set<SimpleQuestionDto> questionSet;
    private Set<SimpleExamDto> examSet;
}
