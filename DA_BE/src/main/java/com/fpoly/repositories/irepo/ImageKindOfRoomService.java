package com.fpoly.repositories.irepo;

import com.fpoly.entities.ImageKindOfRoom;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ImageKindOfRoomService extends IGeneralService<ImageKindOfRoom>{
    List<ImageKindOfRoom> getImageListByKindOfRoomId(Integer kindOfRoomId);
}
