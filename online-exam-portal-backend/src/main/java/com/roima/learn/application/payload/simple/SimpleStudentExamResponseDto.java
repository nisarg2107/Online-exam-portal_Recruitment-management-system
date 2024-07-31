package com.roima.learn.application.payload.simple;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
public class SimpleStudentExamResponseDto {
    private int studentId;
    private int examId;
    private int questionId;
    private boolean mcq;
    private int selectedOptionId;
    private String answer;
    private int obtainedMarks;
    private boolean checked = false;
}
