package com.roima.learn.application.service.impl;

import com.roima.learn.application.config.mapper.CustomMapper;
import com.roima.learn.application.model.*;
import com.roima.learn.application.model.compositekey.StudentExamQuestionAnswerResponseKey;
import com.roima.learn.application.payload.StudentExamQuestionAnswerResponseDto;
import com.roima.learn.application.payload.response.StudentExamQuestionResponseDto;
import com.roima.learn.application.payload.simple.SimpleStudentExamResponseDto;
import com.roima.learn.application.repository.*;
import com.roima.learn.application.service.StudentExamQuestionAnswerResponseService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class StudentExamQuestionAnswerResponseServiceImpl implements StudentExamQuestionAnswerResponseService {
    @Autowired private ModelMapper modelMapper;
    @Autowired private UserRepository studentRepository;
    @Autowired private ExamRepository examRepository;

    @Autowired private StudentExamRepository studentExamRepository;

    @Autowired private ExamQuestionRepository examQuestionRepository;
    @Autowired private QuestionRepository questionRepository;
    @Autowired private OptionRepository optionRepository;
    @Autowired private StudentExamQuestionAnswerResponseRepository studentExamQuestionAnswerResponseRepository;

    @Override
    public StudentExamQuestionResponseDto getStudentExamQuestionAnswerResponse(int pageNumber, int pageSize) {
        pageNumber = Math.max(pageNumber - 1, 0);

        Pageable pageable = PageRequest.of(pageNumber,pageSize);

        Page<StudentExamQuestionAnswerResponse> pageStudentExamResponse = this.studentExamQuestionAnswerResponseRepository.findAll(pageable);

        List<StudentExamQuestionAnswerResponseDto> studentExamResponseDtoList = pageStudentExamResponse
                .getContent()
                .stream()
//                .map(studentExamQuestionAnswerResponse -> this.modelMapper.map(studentExamQuestionAnswerResponse, StudentExamQuestionAnswerResponseDto.class))
                .map(CustomMapper.MAPPER::mapToStudentExamQuestionAnswerResponseDto)
                .collect(Collectors.toList());

        StudentExamQuestionResponseDto studentExamQuestionResponseDto = new StudentExamQuestionResponseDto();
        studentExamQuestionResponseDto.setContent(studentExamResponseDtoList);
        studentExamQuestionResponseDto.setPageNumber(pageNumber + 1);
        studentExamQuestionResponseDto.setPageSize(pageSize);
        studentExamQuestionResponseDto.setTotalElements(pageStudentExamResponse.getTotalElements());
        studentExamQuestionResponseDto.setTotalPages(pageStudentExamResponse.getTotalPages());
        studentExamQuestionResponseDto.setLastPage(pageStudentExamResponse.isLast());
        return studentExamQuestionResponseDto;
    }

    @Override
    public StudentExamQuestionAnswerResponseDto getStudentExamQuestionAnswerResponseById(int studentId, int examId, int questionId) {
        StudentExamQuestionAnswerResponse studentExamQuestionAnswerResponse = this.studentExamQuestionAnswerResponseRepository.findByIdStudentIdAndIdExamIdAndIdQuestionId(
                        studentId,examId,questionId
                )
                .orElseThrow(() -> new NoSuchElementException(
                        "StudentExamQuestionAnswerResponse not found with studentId: "+studentId+" , examId: "+examId+" and questionId: "+questionId
                ));
//        return this.modelMapper.map(studentExamQuestionAnswerResponse, StudentExamQuestionAnswerResponseDto.class);
        return CustomMapper.MAPPER.mapToStudentExamQuestionAnswerResponseDto(studentExamQuestionAnswerResponse);
    }

    @Override
    public Set<StudentExamQuestionAnswerResponseDto> getStudentExamQuestionAnswerResponseByStudentId(int studentId) {
        return this.studentExamQuestionAnswerResponseRepository.findByStudentId(studentId)
                .stream()
//                .map(studentExamQuestionAnswerResponse -> this.modelMapper.map(studentExamQuestionAnswerResponse, StudentExamQuestionAnswerResponseDto.class))
                .map(CustomMapper.MAPPER::mapToStudentExamQuestionAnswerResponseDto)
                .collect(Collectors.toSet());
    }

    @Override
    public Set<StudentExamQuestionAnswerResponseDto> getStudentExamQuestionAnswerResponseByExamId(int examId) {
        return this.studentExamQuestionAnswerResponseRepository.findByExamId(examId)
                .stream()
//                .map(studentExamQuestionAnswerResponse -> this.modelMapper.map(studentExamQuestionAnswerResponse, StudentExamQuestionAnswerResponseDto.class))
                .map(CustomMapper.MAPPER::mapToStudentExamQuestionAnswerResponseDto)
                .collect(Collectors.toSet());
    }

    @Override
    public Set<StudentExamQuestionAnswerResponseDto> getStudentExamQuestionAnswerResponseByQuestionId(int questionId) {
        return this.studentExamQuestionAnswerResponseRepository.findByQuestionId(questionId)
                .stream()
//                .map(studentExamQuestionAnswerResponse -> this.modelMapper.map(studentExamQuestionAnswerResponse, StudentExamQuestionAnswerResponseDto.class))
                .map(CustomMapper.MAPPER::mapToStudentExamQuestionAnswerResponseDto)
                .collect(Collectors.toSet());
    }

    @Override
    public Set<SimpleStudentExamResponseDto> getStudentExamQuestionAnswerResponseByStudentIdAndExamId(int studentId, int examId) {
        Set<StudentExamQuestionAnswerResponseDto>  response =  this.studentExamQuestionAnswerResponseRepository.findByStudentIdAndExamId(studentId, examId)
                .stream()
//                .map(studentExamQuestionAnswerResponse -> this.modelMapper.map(studentExamQuestionAnswerResponse, StudentExamQuestionAnswerResponseDto.class))
                .map(CustomMapper.MAPPER::mapToStudentExamQuestionAnswerResponseDto)
                .collect(Collectors.toSet());

        Set<SimpleStudentExamResponseDto> simpleResponse = response.stream()
                .map((element) -> new SimpleStudentExamResponseDto(
                        element.getStudent().getId(),
                        element.getExam().getId(),
                        element.getQuestion().getId(),
                        element.getQuestion().isMcq(),
                        element.getSelectedOption() != null ? element.getSelectedOption().getId() : 0,
                        element.getAnswer(),
                        element.getObtainedMarks(),
                        false

                        ))
                .collect(Collectors.toSet());

        return simpleResponse;
    }

    @Override
    public StudentExamQuestionAnswerResponseDto createStudentExamQuestionAnswerResponse(int studentId,int examId, int questionId,StudentExamQuestionAnswerResponseDto studentExamQuestionAnswerResponseDto) {
        StudentExamQuestionAnswerResponse studentExamQuestionAnswerResponse = new StudentExamQuestionAnswerResponse();

        User student = this.studentRepository.findById(studentId)
                .orElseThrow(() -> new NoSuchElementException("Student not found with studentId: "+studentId));

        Exam exam = this.examRepository.findById(examId)
                .orElseThrow(() -> new NoSuchElementException("Exam not found with examId: "+examId));

        Question question = this.questionRepository.findById(questionId)
                .orElseThrow(() -> new NoSuchElementException("Question not found with questionId: "+questionId));

        studentExamQuestionAnswerResponse.setId(new StudentExamQuestionAnswerResponseKey(student.getId(),exam.getId(),question.getId()));

        studentExamQuestionAnswerResponse.setStudent(student);
        studentExamQuestionAnswerResponse.setExam(exam);
        studentExamQuestionAnswerResponse.setQuestion(question);
//        studentExamQuestionAnswerResponse.setAnswer(studentExamQuestionAnswerResponseDto.getAnswer());


        if (question.getOptionSet().size() > 1 && question.isMcq()) {
            System.out.println("here exception select op found???????"+studentExamQuestionAnswerResponseDto.getSelectedOption().getId());
            Option option = this.optionRepository.findById(studentExamQuestionAnswerResponseDto.getSelectedOption().getId())
                    .orElseThrow(() -> new NoSuchElementException("Option not found with optionId:"+studentExamQuestionAnswerResponseDto.getSelectedOption().getId()));

            studentExamQuestionAnswerResponse.setSelectedOption(option);
        }
        else {
            studentExamQuestionAnswerResponse.setAnswer(studentExamQuestionAnswerResponseDto.getAnswer());
        }
//        studentExamQuestionAnswerResponse.isSelectedOptionCorrect();

        studentExamQuestionAnswerResponse = this.studentExamQuestionAnswerResponseRepository.save(studentExamQuestionAnswerResponse);
//        return this.modelMapper.map(studentExamQuestionAnswerResponse, StudentExamQuestionAnswerResponseDto.class);
        return CustomMapper.MAPPER.mapToStudentExamQuestionAnswerResponseDto(studentExamQuestionAnswerResponse);
    }

    @Override
    public StudentExamQuestionAnswerResponseDto updateStudentExamQuestionAnswerResponse(int studentId, int examId, int questionId, StudentExamQuestionAnswerResponseDto studentExamQuestionAnswerResponseDto) {

        StudentExamQuestionAnswerResponse studentExamQuestionAnswerResponse = null;
        try {

        studentExamQuestionAnswerResponse = this.studentExamQuestionAnswerResponseRepository.findByIdStudentIdAndIdExamIdAndIdQuestionId(
                        studentId,examId,questionId
                ).get();
        }
        catch (Exception e) {
            return createStudentExamQuestionAnswerResponse(studentId, examId, questionId, studentExamQuestionAnswerResponseDto);
        }

        Question question = this.questionRepository.findById(questionId)
                .orElseThrow(() -> new NoSuchElementException("Question not found with questionId: "+questionId));


//        studentExamQuestionAnswerResponse.setAnswer(studentExamQuestionAnswerResponseDto.getAnswer());

//        Option option = this.optionRepository.findById(studentExamQuestionAnswerResponseDto.getSelectedOption().getId())
//                .orElseThrow(() -> new NoSuchElementException("Option not found with optionId:"+studentExamQuestionAnswerResponseDto.getSelectedOption().getId()));
//
//        studentExamQuestionAnswerResponse.setSelectedOption(option);

        if (question.getOptionSet().size() > 1 && question.isMcq()) {
            System.out.println("here exception select op found???????"+studentExamQuestionAnswerResponseDto.getSelectedOption().getId());
            Option option = this.optionRepository.findById(studentExamQuestionAnswerResponseDto.getSelectedOption().getId())
                    .orElseThrow(() -> new NoSuchElementException("Option not found with optionId:"+studentExamQuestionAnswerResponseDto.getSelectedOption().getId()));

            studentExamQuestionAnswerResponse.setSelectedOption(option);
        }
        else {
            studentExamQuestionAnswerResponse.setAnswer(studentExamQuestionAnswerResponseDto.getAnswer());
        }

        studentExamQuestionAnswerResponse = this.studentExamQuestionAnswerResponseRepository.save(studentExamQuestionAnswerResponse);
//        return this.modelMapper.map(studentExamQuestionAnswerResponse, StudentExamQuestionAnswerResponseDto.class);
        return CustomMapper.MAPPER.mapToStudentExamQuestionAnswerResponseDto(studentExamQuestionAnswerResponse);
    }

    // the below method should work automatically/manually,
    // i.e: Answers should be checked automatically by question and answer...
    // Similarly, admin/checker can also perform it manually by filling TRUE/FALSE

    @Override
    public StudentExamQuestionAnswerResponseDto checkStudentExamQuestionAnswerManual(int studentId, int examId,int questionId, int marks) {
        StudentExamQuestionAnswerResponse studentExamQuestionAnswerResponse = this.studentExamQuestionAnswerResponseRepository.findByIdStudentIdAndIdExamIdAndIdQuestionId(studentId,examId,questionId)
                .orElseThrow(() -> new NoSuchElementException("StudentExamQuestionAnswerResponse not found with studentId: "+studentId+" examId: "+examId+" questionId: "+questionId));

        Exam exam = this.examRepository.findById(examId)
                        .orElseThrow(() ->new NoSuchElementException("Exam not found with examId: "+examId));
        studentExamQuestionAnswerResponse.setObtainedMarks(marks);
        studentExamQuestionAnswerResponse.setChecked(true);
        studentExamQuestionAnswerResponse = this.studentExamQuestionAnswerResponseRepository.save(studentExamQuestionAnswerResponse);

        StudentExam studentExam = this.studentExamRepository.findByIdUserIdAndIdExamId(studentId,examId)
                .orElseThrow(() -> new NoSuchElementException("Student Exam not found with studentId:"+studentId+" examId: "+examId));
        studentExam.setMarks(studentExam.getMarks() + marks - studentExamQuestionAnswerResponse.getObtainedMarks());

        System.out.println("student exam marks::::::::::::"+studentExam.getMarks());
        if (studentExam.getMarks() >= exam.getPassingMarks()) {
            studentExam.setPassed(true);
        }
        this.studentExamRepository.save(studentExam);

        return CustomMapper.MAPPER.mapToStudentExamQuestionAnswerResponseDto(studentExamQuestionAnswerResponse);

    }

    @Override
    public Set<StudentExamQuestionAnswerResponseDto> checkStudentExamQuestionAnswerAutomatic(int studentId, int examId) {
        Exam exam = this.examRepository.findById(examId)
                .orElseThrow(() -> new NoSuchElementException("Exam not found with id: "+examId));
        AtomicInteger total = new AtomicInteger();
        Set<StudentExamQuestionAnswerResponseDto> response =  this.studentExamQuestionAnswerResponseRepository.findByStudentIdAndExamId(studentId, examId)
                .stream()
//                .map(studentExamQuestionAnswerResponse -> this.modelMapper.map(studentExamQuestionAnswerResponse, StudentExamQuestionAnswerResponseDto.class))
                .map((element) -> {
                       Question question = this.questionRepository.findById(element.getQuestion().getId())
                               .orElseThrow(() -> new NoSuchElementException("Question not found with id"+element.getQuestion().getId()));
                       if (question.isMcq() && question.getOptionSet().size() > 1 && element.getSelectedOption().isCorrect()) {
                           ExamQuestion examQuestion = this.examQuestionRepository.findByIdExamIdAndIdQuestionId(exam.getId(), question.getId()).get();
                           element.setObtainedMarks((int)examQuestion.getWeightage());
//                            this.questionRepository.findCorrectAnswerOfQuestion(question.getId(), element.getSelectedOption().getId());
                           element.setSelectedOptionCorrect(true);
                           element.setChecked(true);
                           total.set(total.get() + (int) examQuestion.getWeightage());
                           return CustomMapper.MAPPER.mapToStudentExamQuestionAnswerResponseDto(this.studentExamQuestionAnswerResponseRepository.save(element));
                       }
                    total.set(total.get() + element.getObtainedMarks());
                    return CustomMapper.MAPPER.mapToStudentExamQuestionAnswerResponseDto(element);
                    }
                )
                .collect(Collectors.toSet());

        StudentExam studentExam = this.studentExamRepository.findByIdUserIdAndIdExamId(studentId,examId)
                  .orElseThrow(() -> new NoSuchElementException("Student Exam not found with studentId:"+studentId+" examId: "+examId));
        studentExam.setMarks(total.get());

        System.out.println("student exam marks::::::::::::"+studentExam.getMarks());
        if (studentExam.getMarks() >= exam.getPassingMarks()) {
            studentExam.setPassed(true);
        }
        this.studentExamRepository.save(studentExam);
//        return this.modelMapper.map(studentExamQuestionAnswerResponse, StudentExamQuestionAnswerResponseDto.class);
//        return CustomMapper.MAPPER.mapToStudentExamQuestionAnswerResponseDto(studentExamQuestionAnswerResponse);
        return response;
    }

    @Override
    public void deleteStudentExamQuestionAnswerResponse(int studentId, int examId, int questionId) {
        StudentExamQuestionAnswerResponse studentExamQuestionAnswerResponse = this.studentExamQuestionAnswerResponseRepository.findByIdStudentIdAndIdExamIdAndIdQuestionId(
                        studentId,examId,questionId
                )
                .orElseThrow(() -> new NoSuchElementException(
                        "StudentExamQuestionAnswerResponse not found with studentId: "+studentId+" , examId: "+examId+" and questionId: "+questionId
                ));
        this.studentExamQuestionAnswerResponseRepository.delete(studentExamQuestionAnswerResponse);
    }
}
