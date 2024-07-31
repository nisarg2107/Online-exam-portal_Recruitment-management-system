package com.roima.learn.application.payload;

import com.roima.learn.application.payload.simple.SimpleExamDto;
import com.roima.learn.application.payload.simple.SimpleQuestionDto;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
public class ExamQuestionDto {
    private SimpleExamDto exam;

    private SimpleQuestionDto question;

    private float weightage;
}
