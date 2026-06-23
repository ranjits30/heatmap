package com.heatmap.repository;

import com.heatmap.entity.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    List<Assessment> findByEmployeeProfileId(Long employeeProfileId);
}
