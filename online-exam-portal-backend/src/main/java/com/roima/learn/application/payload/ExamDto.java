package com.roima.learn.application.payload;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.roima.learn.application.payload.simple.CategoryWithMarksDto;
import com.roima.learn.application.payload.simple.SimpleDifficultyDto;
import lombok.*;

import javax.persistence.Transient;
import java.util.Date;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
public class ExamDto {
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

//    private Set<SimpleCategoryDto> categorySet;

    private Set<StudentExamDto> studentExamSet;

    // we didnt used simple... because ExamQuestionDto contains simple dto object only
    private Set<ExamQuestionDto> examQuestionSet;

    private SimpleDifficultyDto difficulty;

    @Transient
    private  Set<CategoryWithMarksDto> categoryWithMarksDtoSet;
}
