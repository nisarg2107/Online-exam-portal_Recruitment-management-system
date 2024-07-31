package com.roima.learn.application.controller;

import com.roima.learn.application.payload.ImageDto;
import com.roima.learn.application.payload.response.ImageResponseDto;
import com.roima.learn.application.payload.response.ResponseDto;
import com.roima.learn.application.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
//@RequestMapping("/image")
//@AllArgsConstructor
public class ImageController {

    @Autowired
    private ImageService imageService;

//    @GetMapping("/")
    public ResponseEntity<ImageResponseDto> getImages(
            @RequestParam(value = "pageNumber",defaultValue = "1", required = false) int pageNumber,
            @RequestParam(value = "pageSize",defaultValue = "5", required = false) int pageSize
    ) {

        return ResponseEntity.ok(this.imageService.getImage(pageNumber, pageSize));
    }

//    @GetMapping("/{id}")
    public ResponseEntity<ImageDto> getImageById(@PathVariable int id) {
        return ResponseEntity.ok(this.imageService.getImageById(id));
    }

//    @PostMapping("/")
    public ResponseEntity<ImageDto> createImage(@RequestBody ImageDto imageDto) {
        return new ResponseEntity<>(this.imageService.createImage(imageDto),HttpStatus.CREATED);
    }

//    @PutMapping("/{id}")
    public ResponseEntity<ImageDto> updateImage(@PathVariable int id, @RequestBody ImageDto imageDto) {
        return new ResponseEntity<>(this.imageService.updateImage(id, imageDto),HttpStatus.CREATED);
    }

//    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDto> deleteImage(@PathVariable int id) {
        this.imageService.deleteImage(id);
        return ResponseEntity.ok(new ResponseDto("Deletion performed successfully ", HttpStatus.NO_CONTENT.value(), true));
    }

}
