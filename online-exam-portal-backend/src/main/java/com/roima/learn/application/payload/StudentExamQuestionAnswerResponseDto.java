package com.roima.learn.application.payload;

import com.roima.learn.application.payload.simple.SimpleExamDto;
import com.roima.learn.application.payload.simple.SimpleOptionDto;
import com.roima.learn.application.payload.simple.SimpleQuestionDto;
import com.roima.learn.application.payload.simple.SimpleUserDto;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
public class StudentExamQuestionAnswerResponseDto {

    // Bi-direction as student can view his response
    private SimpleUserDto student;

    // other fields don't need bidirectional flow

    private SimpleExamDto exam;

    private SimpleQuestionDto question;

    private SimpleOptionDto selectedOption;

    private String answer;

    private boolean selectedOptionCorrect;
    private boolean checked = false;

    private int obtainedMarks = 0;

}
