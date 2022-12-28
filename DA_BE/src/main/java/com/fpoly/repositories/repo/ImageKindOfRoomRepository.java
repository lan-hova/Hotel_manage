package com.fpoly.repositories.repo;

import com.fpoly.entities.ImageKindOfRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageKindOfRoomRepository extends JpaRepository<ImageKindOfRoom, Integer> {
    @Query("select i from ImageKindOfRoom i where i.kindOfRoom.id = :kindOfRoomId")
    List<ImageKindOfRoom> getImageListByKindOfRoomId(@Param("kindOfRoomId") Integer kindOfRoomId);
}
