package com.fpoly.repositories.imp;

import com.fpoly.entities.ConfigTime;
import com.fpoly.repositories.irepo.IConfigTimeService;
import com.fpoly.repositories.repo.ConfigTimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class IConfigTimeServiceImp implements IConfigTimeService {

    @Autowired
    private ConfigTimeRepository configTimeRepository;

    @Override
    public Iterable<ConfigTime> findAll() {
        return configTimeRepository.findAll();
    }

    @Override
    public Optional<ConfigTime> findById(Integer id) {
        return configTimeRepository.findById(id);
    }

    @Override
    public ConfigTime save(ConfigTime configTime) {
        return configTimeRepository.save(configTime);
    }

    @Override
    public void remove(Integer id) {
        configTimeRepository.deleteById(id);
    }
}
