package com.roima.learn.application.payload.response;

import com.roima.learn.application.payload.QuestionDto;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionResponseDto {
    private List<QuestionDto> content;
    private int pageNumber;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean lastPage;
}
