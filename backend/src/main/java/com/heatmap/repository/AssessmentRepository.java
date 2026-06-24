package com.heatmap.repository;

import com.heatmap.entity.Assessment;
import com.heatmap.entity.AssessmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    List<Assessment> findByEmployeeProfileId(Long employeeProfileId);
    List<Assessment> findByEmployeeProfileIdAndStatusOrderBySubmittedAtDesc(Long employeeProfileId, AssessmentStatus status);
}
