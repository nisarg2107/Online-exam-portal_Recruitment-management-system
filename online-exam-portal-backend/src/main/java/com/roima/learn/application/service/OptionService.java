package com.roima.learn.application.service;

import com.roima.learn.application.payload.OptionDto;
import com.roima.learn.application.payload.response.OptionResponseDto;

public interface OptionService {
    OptionResponseDto getOption(int pageNumber, int pageSize);
    OptionDto getOptionById(int id);
    OptionDto createOption(OptionDto optionDto);
    OptionDto updateOption(int id, OptionDto optionDto);
    void deleteOption(int id);
}
