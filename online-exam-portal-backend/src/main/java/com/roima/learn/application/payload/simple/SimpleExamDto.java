package com.roima.learn.application.payload.simple;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
public class SimpleExamDto {
    private int id;
    private String name;

    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern="dd/MM/yyyy")
    private Date createdDate;
    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern="dd/MM/yyyy")
    private Date startDate;
    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern="dd/MM/yyyy")
    private Date endDate;
    private float duration;
    private int passingMarks;

    private float mcqRatio;
    private float notMcqQuestionWeightage;
    private float difficultyRatio;

    private int totalMarks;
}
