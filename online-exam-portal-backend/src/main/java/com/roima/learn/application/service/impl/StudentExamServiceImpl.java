package com.roima.learn.application.service.impl;

import com.roima.learn.application.config.mapper.CustomMapper;
import com.roima.learn.application.model.Exam;
import com.roima.learn.application.model.StudentExam;
import com.roima.learn.application.model.User;
import com.roima.learn.application.model.compositekey.StudentExamKey;
import com.roima.learn.application.payload.ExamDto;
import com.roima.learn.application.payload.StudentExamDto;
import com.roima.learn.application.payload.UserDto;
import com.roima.learn.application.payload.response.StudentExamResponseDto;
import com.roima.learn.application.repository.ExamRepository;
import com.roima.learn.application.repository.StudentExamRepository;
import com.roima.learn.application.repository.UserRepository;
import com.roima.learn.application.service.StudentExamService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class StudentExamServiceImpl implements StudentExamService {

    @Autowired private StudentExamRepository studentExamRepository;
    @Autowired private UserRepository studentUserRepository;
    @Autowired private ExamRepository examRepository;
    @Autowired private ModelMapper modelMapper;

    @Override
    public StudentExamResponseDto getStudentExam(int pageNumber, int pageSize) {
        pageNumber = Math.max(pageNumber - 1, 0);

        Pageable pageable = PageRequest.of(pageNumber,pageSize);

        Page<StudentExam> pageStudentExam = this.studentExamRepository.findAll(pageable);

        List<StudentExamDto> studentExamDtoList = pageStudentExam
                .getContent()
                .stream()
//                .map(studentExam -> this.modelMapper.map(studentExam,StudentExamDto.class))
                .map(CustomMapper.MAPPER::mapToStudentExamDto)
                .collect(Collectors.toList());

        StudentExamResponseDto studentExamResponseDto = new StudentExamResponseDto();
        studentExamResponseDto.setContent(studentExamDtoList);
        studentExamResponseDto.setPageNumber(pageNumber + 1);
        studentExamResponseDto.setPageSize(pageSize);
        studentExamResponseDto.setTotalElements(pageStudentExam.getTotalElements());
        studentExamResponseDto.setTotalPages(pageStudentExam.getTotalPages());
        studentExamResponseDto.setLastPage(pageStudentExam.isLast());
        return studentExamResponseDto;
    }

    @Override
    public StudentExamDto getStudentExamById(int studentId, int examId) {
        StudentExam studentExam = this.studentExamRepository.findByIdUserIdAndIdExamId(studentId,examId)
                .orElseThrow(() -> new NoSuchElementException("Student Exam not found with studentId: "+studentId+" and examId: "+examId));
//        return this.modelMapper.map(studentExam,StudentExamDto.class);
        return CustomMapper.MAPPER.mapToStudentExamDto(studentExam);
    }

    @Override
    public Set<ExamDto> getExamByStudentId(int studentId) {
        return this.studentExamRepository.findByUserId(studentId)
                .stream()
//                .map(studentExam -> this.modelMapper.map(studentExam,ExamDto.class))
                .map(CustomMapper.MAPPER::mapToExamDto)
                .collect(Collectors.toSet());
    }

    @Override
    public Set<UserDto> getStudentByExamId(int examId) {
        return this.studentExamRepository.findByExamId(examId)
                .stream()
//                .map(studentExam -> this.modelMapper.map(studentExam,UserDto.class))
                .map(CustomMapper.MAPPER::mapToUserDto)
                .collect(Collectors.toSet());
    }

    @Override
    public StudentExamDto createStudentExam(int studentId, int examId,StudentExamDto studentExamDto) {
        StudentExam studentExam = new StudentExam();

        studentExam.setExam(
                this.examRepository.findById(examId)
                        .orElseThrow(() -> new NoSuchElementException("Exam not found with id: "+examId))
        );

        studentExam.setUser(
                this.studentUserRepository.findById(studentId)
                        .orElseThrow(() -> new NoSuchElementException("Student not found with id: "+studentId))

        );

        studentExam.setId(
                new StudentExamKey(
                        studentExamDto.getUser().getId(),
                        studentExamDto.getExam().getId()
                        )
        );
        studentExam.setMarks(studentExamDto.getMarks());
        studentExam.setPassed(studentExamDto.isPassed());
        studentExam.setIpAddress(studentExamDto.getIpAddress());
        studentExam.setSubmitted(false);


        try {

            InetAddress localHost = InetAddress.getLocalHost();
            NetworkInterface ni = NetworkInterface.getByInetAddress(localHost);
            byte[] hardwareAddress = ni.getHardwareAddress();

            String[] hexadecimal = new String[hardwareAddress.length];
            for (int i = 0; i < hardwareAddress.length; i++) {
                hexadecimal[i] = String.format("%02X", hardwareAddress[i]);
            }
            String macAddress = String.join("-", hexadecimal);

            studentExam.setMacAddress(macAddress);
        }
        catch (Exception e) {
            e.printStackTrace();
        }

        try (final DatagramSocket datagramSocket = new DatagramSocket()) {
            datagramSocket.connect(InetAddress.getByName("8.8.8.8"), 12345);
            studentExam.setIpAddress(datagramSocket.getLocalAddress().getHostAddress());
        }
        catch(Exception e) {
            e.printStackTrace();
        }

        StudentExam createdStudentExam = this.studentExamRepository.save(studentExam);
//        return this.modelMapper.map(createdStudentExam, StudentExamDto.class);
        return CustomMapper.MAPPER.mapToStudentExamDto(createdStudentExam);
    }

    @Override
    public StudentExamDto updateStudentExam(int studentId, int examId, StudentExamDto studentExamDto) {

        StudentExam studentExam = this.studentExamRepository.findByIdUserIdAndIdExamId(studentId,examId)
                .orElseThrow(() -> new NoSuchElementException("Record not found with studentId: "+studentId));
        studentExam.setExam(
                this.examRepository.findById(studentExamDto.getExam().getId())
                        .orElseThrow(() -> new NoSuchElementException("Exam not found with id: "+studentExamDto.getExam().getId()))
        );

        studentExam.setUser(
                this.studentUserRepository.findById(studentExamDto.getUser().getId())
                        .orElseThrow(() -> new NoSuchElementException("Student not found with id: "+studentExamDto.getExam().getId()))

        );

        studentExam.setMarks(studentExamDto.getMarks());
        studentExam.setPassed(studentExamDto.isPassed());
        studentExam.setIpAddress(studentExam.getIpAddress());
        studentExam.setMacAddress(studentExam.getMacAddress());

//        System.out.println();
        studentExam.setSubmitted(studentExamDto.isSubmitted());

        StudentExam updatedStudentExam = this.studentExamRepository.save(studentExam);
//        return this.modelMapper.map(updatedStudentExam, StudentExamDto.class);
        return CustomMapper.MAPPER.mapToStudentExamDto(updatedStudentExam);
    }

    @Override
    public StudentExamDto updateStudentExamStatus(int studentId, int examId, StudentExamDto studentExamDto) {
        StudentExam studentExam = this.studentExamRepository.findByIdUserIdAndIdExamId(studentId,examId)
                .orElseThrow(() -> new NoSuchElementException("Record not found with studentId: "+studentId));

//        System.out.println();
        studentExam.setStatus(studentExamDto.getStatus());

        StudentExam updatedStudentExam = this.studentExamRepository.save(studentExam);
//        return this.modelMapper.map(updatedStudentExam, StudentExamDto.class);
        return CustomMapper.MAPPER.mapToStudentExamDto(updatedStudentExam);
    }

    @Transactional
    @Override
    public void deleteStudentExam(int studentId, int examId) {
        User user = this.studentUserRepository.findById(studentId)
                .orElseThrow(() -> new NoSuchElementException("Student not found with id: "+studentId));
        Exam exam = this.examRepository.findById(examId)
                .orElseThrow(() -> new NoSuchElementException("Exam not found with id: "+studentId));

        this.studentExamRepository.deleteByIdUserIdAndIdExamId(studentId,examId);
    }
}
