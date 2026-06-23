package com.heatmap.controller;

import com.heatmap.entity.SkillCategory;
import com.heatmap.repository.SkillCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    @Autowired
    private SkillCategoryRepository skillCategoryRepository;

    @GetMapping
    public List<SkillCategory> getAllCategories() {
        return skillCategoryRepository.findAll();
    }
}
