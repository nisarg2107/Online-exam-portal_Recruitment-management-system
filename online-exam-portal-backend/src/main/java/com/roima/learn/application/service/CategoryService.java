package com.roima.learn.application.service;

import com.roima.learn.application.payload.CategoryDto;
import com.roima.learn.application.payload.response.CategoryResponseDto;

public interface CategoryService {
    CategoryResponseDto getCategory(int pageNumber, int pageSize);
    CategoryDto getCategoryById(int id);
    CategoryDto createCategory(CategoryDto categoryDto);
    CategoryDto updateCategory(int id, CategoryDto categoryDto);
    void deleteCategory(int id);
}
