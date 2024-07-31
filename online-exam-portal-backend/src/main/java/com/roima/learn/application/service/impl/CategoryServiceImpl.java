package com.roima.learn.application.service.impl;

import com.roima.learn.application.config.mapper.CustomMapper;
import com.roima.learn.application.model.Category;
import com.roima.learn.application.payload.CategoryDto;
import com.roima.learn.application.payload.response.CategoryResponseDto;
import com.roima.learn.application.repository.CategoryRepository;
import com.roima.learn.application.service.CategoryService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public CategoryResponseDto getCategory(int pageNumber, int pageSize) {
        pageNumber = Math.max(pageNumber - 1, 0);

        Pageable pageable = PageRequest.of(pageNumber,pageSize);

        Page<Category> pageCategory = this.categoryRepository.findAll(pageable);

        List<CategoryDto> categoryDtoList = pageCategory
                .getContent()
                .stream()
//                .map(category -> this.modelMapper.map(category,CategoryDto.class))
                .map(CustomMapper.MAPPER::mapToCategoryDto)
                .collect(Collectors.toList());

        CategoryResponseDto categoryResponseDto = new CategoryResponseDto();
        categoryResponseDto.setContent(categoryDtoList);
        categoryResponseDto.setPageNumber(pageNumber + 1);
        categoryResponseDto.setPageSize(pageSize);
        categoryResponseDto.setTotalElements(pageCategory.getTotalElements());
        categoryResponseDto.setTotalPages(pageCategory.getTotalPages());
        categoryResponseDto.setLastPage(pageCategory.isLast());
        return categoryResponseDto;
    }

    @Override
    public CategoryDto getCategoryById(int id) {
        Category category = this.categoryRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Category not found with id : "+id));
//        return this.modelMapper.map(category,CategoryDto.class);
        return CustomMapper.MAPPER.mapToCategoryDto(category);
    }

    @Override
    public CategoryDto createCategory(CategoryDto categoryDto) {
        Category category = new Category();
        category.setType(categoryDto.getType());
        Category createdCategory = this.categoryRepository.save(category);
//        return this.modelMapper.map(createdCategory,CategoryDto.class);
        return CustomMapper.MAPPER.mapToCategoryDto(createdCategory);
    }

    @Override
    public CategoryDto updateCategory(int id, CategoryDto categoryDto) {
        Category category = this.categoryRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Category not found with id : "+id));
        category.setType(categoryDto.getType());
        Category updatedCategory = this.categoryRepository.save(category);
//        return this.modelMapper.map(updatedCategory,CategoryDto.class);
        return CustomMapper.MAPPER.mapToCategoryDto(updatedCategory);
    }

    @Override
    public void deleteCategory(int id) {
        if (this.categoryRepository.existsById(id)) this.categoryRepository.deleteById(id);
        else {
            throw new NoSuchElementException("Category not found with id : " + id);
        }
    }
}
