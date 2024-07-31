package com.roima.learn.application.payload.response;

import com.roima.learn.application.payload.ExamDto;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExamResponseDto {
    private List<ExamDto> content;
    private int pageNumber;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean lastPage;
}
