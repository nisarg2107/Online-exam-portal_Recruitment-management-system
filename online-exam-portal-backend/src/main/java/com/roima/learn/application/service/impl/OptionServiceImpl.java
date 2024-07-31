package com.roima.learn.application.service.impl;

import com.roima.learn.application.config.mapper.CustomMapper;
import com.roima.learn.application.model.Option;
import com.roima.learn.application.payload.OptionDto;
import com.roima.learn.application.payload.response.OptionResponseDto;
import com.roima.learn.application.repository.OptionRepository;
import com.roima.learn.application.repository.QuestionRepository;
import com.roima.learn.application.service.OptionService;
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
public class OptionServiceImpl implements OptionService {

    @Autowired
    private OptionRepository optionRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public OptionResponseDto getOption(int pageNumber, int pageSize) {
        pageNumber = Math.max(pageNumber - 1, 0);

        Pageable pageable = PageRequest.of(pageNumber,pageSize);

        Page<Option> pageOption = this.optionRepository.findAll(pageable);

        List<OptionDto> optionDtoList = pageOption
                .getContent()
                .stream()
//                .map(option -> this.modelMapper.map(option,OptionDto.class))
                .map(CustomMapper.MAPPER::mapToOptionDto)
                .collect(Collectors.toList());

        OptionResponseDto optionResponseDto = new OptionResponseDto();
        optionResponseDto.setContent(optionDtoList);
        optionResponseDto.setPageNumber(pageNumber + 1);
        optionResponseDto.setPageSize(pageSize);
        optionResponseDto.setTotalElements(pageOption.getTotalElements());
        optionResponseDto.setTotalPages(pageOption.getTotalPages());
        optionResponseDto.setLastPage(pageOption.isLast());
        return optionResponseDto;
    }

    @Override
    public OptionDto getOptionById(int id) {
        Option option = this.optionRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Option not found with id : "+id));
//        return this.modelMapper.map(option,OptionDto.class);
        return CustomMapper.MAPPER.mapToOptionDto(option);
    }

    @Override
    public OptionDto createOption(OptionDto optionDto) {
        Option option = new Option();

        option.setName(optionDto.getName());

        option.setQuestion(
                this.questionRepository.findById(optionDto.getQuestion().getId())
                        .orElseThrow(() -> new NoSuchElementException("Question not found with id : " + optionDto.getQuestion().getId()))
        );

        option.setCorrect(optionDto.isCorrect());

        Option createdOption = this.optionRepository.save(option);
//        return this.modelMapper.map(createdOption,OptionDto.class);
        return CustomMapper.MAPPER.mapToOptionDto(createdOption);
    }

    @Override
    public OptionDto updateOption(int id, OptionDto optionDto) {
        Option option = this.optionRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Option not found with id : "+id));

        option.setName(optionDto.getName());

        option.setQuestion(
                this.questionRepository.findById(optionDto.getQuestion().getId())
                        .orElseThrow(() -> new NoSuchElementException("Question not found with id : " + optionDto.getQuestion().getId()))
        );

        option.setCorrect(optionDto.isCorrect());

        Option updatedOption = this.optionRepository.save(option);
//        return this.modelMapper.map(updatedOption,OptionDto.class);
        return CustomMapper.MAPPER.mapToOptionDto(updatedOption);
    }

    @Override
    public void deleteOption(int id) {
        if (this.optionRepository.existsById(id)) this.optionRepository.deleteById(id);
        else {
            throw new NoSuchElementException("Option not found with id : " + id);
        }
    }
}
