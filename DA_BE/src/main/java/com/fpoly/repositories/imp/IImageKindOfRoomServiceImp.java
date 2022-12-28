package com.fpoly.repositories.imp;

import com.fpoly.entities.ImageKindOfRoom;
import com.fpoly.repositories.irepo.ImageKindOfRoomService;
import com.fpoly.repositories.repo.ImageKindOfRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IImageKindOfRoomServiceImp implements ImageKindOfRoomService {

    @Autowired
    ImageKindOfRoomRepository imageKindOfRoomRepository;

    @Override
    public Iterable<ImageKindOfRoom> findAll() {
        return imageKindOfRoomRepository.findAll();
    }

    @Override
    public Optional<ImageKindOfRoom> findById(Integer id) {
        return imageKindOfRoomRepository.findById(id);
    }

    @Override
    public ImageKindOfRoom save(ImageKindOfRoom imageKindOfRoom) {
        return imageKindOfRoomRepository.save(imageKindOfRoom);
    }

    @Override
    public void remove(Integer id) {
        imageKindOfRoomRepository.deleteById(id);
    }

    @Override
    public List<ImageKindOfRoom> getImageListByKindOfRoomId(Integer kindOfRoomId) {
        return imageKindOfRoomRepository.getImageListByKindOfRoomId(kindOfRoomId);
    }
}
