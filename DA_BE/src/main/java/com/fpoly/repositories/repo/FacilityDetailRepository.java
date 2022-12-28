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

import com.fpoly.entities.FacilitiesDetails;
import com.fpoly.entities.Rooms;

/**
 *
 * @author trucnv 
 *
 */
@Repository
public interface FacilityDetailRepository extends JpaRepository<FacilitiesDetails, Integer>{
	@Query("SELECT entity FROM FacilitiesDetails entity WHERE rooms=:rooms")
	public Iterable<FacilitiesDetails> findByRoomId(@Param("rooms") Optional<Rooms> rooms);

	List<FacilitiesDetails> findByRoomsAndStatus(Rooms rooms, int status);
}
