/**
 * 
 */
package com.fpoly.repositories.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.fpoly.entities.Rooms;
import com.fpoly.entities.ServiceAvailable;

/**
 *
 * @author trucnv 
 *
 */
@Repository
public interface ServiceAvailableRepository extends JpaRepository<ServiceAvailable, Integer>{
    @Query("SELECT entity FROM ServiceAvailable entity WHERE rooms=:rooms")
    public Iterable<ServiceAvailable> findByRoomId(@Param("rooms") Optional<Rooms> rooms);

    List<ServiceAvailable> findByRoomsAndStatus(Rooms rooms, int status);
}
