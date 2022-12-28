/**
 * 
 */
package com.fpoly.repositories.repo;

import com.fpoly.entities.KindOfRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.fpoly.entities.Rooms;

import java.time.LocalDate;
import java.util.Optional;

/**
 *
 * @author trucnv 
 *
 */
@Repository
public interface RoomRepository extends JpaRepository<Rooms, Integer>{
    @Query("select count(*) from Rooms  Where kindOfRoom = :kindOfRoom GROUP BY kindOfRoom")
    public Integer CountRoomByKindOfRoom(@Param("kindOfRoom") Optional<KindOfRoom> kindOfRoom);

//    @Query("select entity from Rooms entity where id not in ( select rooms.id from DetailsInvoice \n" +
//            "where bills.id in (select id from Bills  Where id in (select bills.id from Booking where (dateOfHire <=:dateOfHire AND checkOutDay >= :dateOfHire) OR (dateOfHire <= :checkOutDay AND checkOutDay >= :checkOutDay) AND status = 2)))" +
//            "and kindOfRoom = :kindOfRoom")
//    public Iterable<Rooms> getRoomByBooking(@Param("dateOfHire") LocalDate dateOfHire, @Param("checkOutDay") LocalDate checkOutDay, @Param("kindOfRoom") Optional<KindOfRoom> kindOfRoom);
}
