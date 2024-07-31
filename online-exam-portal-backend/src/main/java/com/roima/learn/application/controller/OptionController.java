package com.roima.learn.application.controller;

import com.roima.learn.application.payload.OptionDto;
import com.roima.learn.application.payload.response.OptionResponseDto;
import com.roima.learn.application.payload.response.ResponseDto;
import com.roima.learn.application.service.OptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/option")
//@AllArgsConstructor
public class OptionController {

    @Autowired
    private OptionService optionService;

    @GetMapping("/")
    public ResponseEntity<OptionResponseDto> getOptions(
            @RequestParam(value = "pageNumber",defaultValue = "1", required = false) int pageNumber,
            @RequestParam(value = "pageSize",defaultValue = "5", required = false) int pageSize) {

        return ResponseEntity.ok(this.optionService.getOption(pageNumber, pageSize));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OptionDto> getOptionById(@PathVariable int id) {

        return ResponseEntity.ok(this.optionService.getOptionById(id));
    }

    @PostMapping("/")
    public ResponseEntity<OptionDto> createOption(@RequestBody OptionDto optionDto) {
        return new ResponseEntity<>(this.optionService.createOption(optionDto),HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OptionDto> updateOption(@PathVariable int id, @RequestBody OptionDto optionDto) {
        return new ResponseEntity<>(this.optionService.updateOption(id, optionDto),HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDto> deleteOption(@PathVariable int id) {
        this.optionService.deleteOption(id);
        return ResponseEntity.ok(new ResponseDto("Deletion performed successfully ", HttpStatus.NO_CONTENT.value(), true));
    }

}
