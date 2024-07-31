package com.roima.learn.application.controller;

import com.roima.learn.application.payload.CategoryDto;
import com.roima.learn.application.payload.response.CategoryResponseDto;
import com.roima.learn.application.payload.response.ResponseDto;
import com.roima.learn.application.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/category")
//@AllArgsConstructor
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/")
    public ResponseEntity<CategoryResponseDto> getCategories(
            @RequestParam(value = "pageNumber",defaultValue = "1", required = false) int pageNumber,
            @RequestParam(value = "pageSize",defaultValue = "5", required = false) int pageSize
    ) {
//        ArrayList categoryList = new ArrayList<>();
        return ResponseEntity.ok(this.categoryService.getCategory(pageNumber,pageSize));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getCategoryById(@PathVariable int id) {

        return ResponseEntity.ok(this.categoryService.getCategoryById(id));
    }

    @PostMapping("/")
    public ResponseEntity<CategoryDto> createCategory(@RequestBody CategoryDto categoryDto) {
//        return ResponseEntity.ok(this.categoryService.createCategory(categoryDto));
        return new ResponseEntity<>(this.categoryService.createCategory(categoryDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto> updateCategory(@PathVariable int id, @RequestBody CategoryDto categoryDto) {
        return new ResponseEntity<>(this.categoryService.updateCategory(id, categoryDto), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDto> deleteCategory(@PathVariable int id) {
        this.categoryService.deleteCategory(id);
        return ResponseEntity.ok(new ResponseDto("Deletion performed successfully ", HttpStatus.NO_CONTENT.value(), true));
    }

}
