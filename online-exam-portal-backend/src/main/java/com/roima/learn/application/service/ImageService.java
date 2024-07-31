package com.roima.learn.application.service;

import com.roima.learn.application.payload.ImageDto;
import com.roima.learn.application.payload.response.ImageResponseDto;

public interface ImageService {
    ImageResponseDto getImage(int pageNumber, int pageSize);
    ImageDto getImageById(int id);
    ImageDto createImage(ImageDto imageDto);
    ImageDto updateImage(int id, ImageDto imageDto);
    void deleteImage(int id);
}
