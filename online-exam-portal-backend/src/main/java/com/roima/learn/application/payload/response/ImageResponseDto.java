package com.roima.learn.application.payload.response;

import com.roima.learn.application.payload.ImageDto;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImageResponseDto {
    private List<ImageDto> content;
    private int pageNumber;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean lastPage;
}
