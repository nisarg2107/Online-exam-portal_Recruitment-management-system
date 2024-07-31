package com.roima.learn.application.payload.response;

import com.roima.learn.application.payload.StudentExamQuestionAnswerResponseDto;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentExamQuestionResponseDto {
    private List<StudentExamQuestionAnswerResponseDto> content;
    private int pageNumber;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean lastPage;
}
