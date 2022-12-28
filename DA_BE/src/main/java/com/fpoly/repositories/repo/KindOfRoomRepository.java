/**
 * 
 */
package com.fpoly.repositories.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fpoly.entities.KindOfRoom;

/**
 *
 * @author trucnv 
 *
 */
@Repository
public interface KindOfRoomRepository extends JpaRepository<KindOfRoom, Integer>{

}
