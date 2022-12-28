package com.fpoly.restcontrollers;

import com.fpoly.entities.ImageKindOfRoom;
import com.fpoly.repositories.imp.IImageKindOfRoomServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/image-kind-of-room")
public class ImageKindOfRoomAPI {

    @Autowired
    IImageKindOfRoomServiceImp iImageKindOfRoomServiceImp;

    @PostMapping
    public ResponseEntity<?> saveImageKindOfRoom(@RequestBody ImageKindOfRoom imageKindOfRoom) {
        return new ResponseEntity<>(iImageKindOfRoomServiceImp.save(imageKindOfRoom), HttpStatus.OK);
    }

    @GetMapping("/list-by-kind-of-room-id/{kindOfRoomId}")
    public ResponseEntity<?> getListImageByKindOfRoomId(@PathVariable Integer kindOfRoomId) {
        return new ResponseEntity<>(iImageKindOfRoomServiceImp.getImageListByKindOfRoomId(kindOfRoomId), HttpStatus.OK);
    }
}
