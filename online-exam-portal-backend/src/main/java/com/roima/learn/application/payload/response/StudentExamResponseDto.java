package com.roima.learn.application.payload.response;

import com.roima.learn.application.payload.StudentExamDto;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentExamResponseDto {
    private List<StudentExamDto> content;
    private int pageNumber;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean lastPage;
}
