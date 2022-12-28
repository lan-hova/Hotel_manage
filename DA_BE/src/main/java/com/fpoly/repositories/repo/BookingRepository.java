/**
 * 
 */
package com.fpoly.repositories.repo;

import com.fpoly.entities.Bills;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.fpoly.entities.Booking;

import java.time.LocalDate;
import java.util.List;

/**
 *
 * @author trucnv 
 *
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer>{
    @Query("SELECT COUNT(*) FROM Booking WHERE (dateOfHire <=:dateOfHire AND checkOutDay >= :dateOfHire) OR (dateOfHire <= :checkOutDay AND checkOutDay >= :checkOutDay) AND status >:status")
    public Integer CountRoomByTimeBooking(@Param("dateOfHire") LocalDate dateOfHire, @Param("checkOutDay") LocalDate checkOutDay, @Param("status") int status);
//    @Query("SELECT entity FROM Booking entity WHERE status=:status")
//    Iterable<Booking> findByStatus (@Param("status") Integer status);

    List<Booking> findByStatusAndPaymentStatus(Integer status, Integer paymentStatus);

    @Query("select b from Booking b where b.status = 1 and b.paymentStatus = 2")
    List<Booking> getAllBookingPaid();

    @Query("select b from Booking b where b.paymentStatus = 1 and b.status = 1")
    List<Booking> getAllBookingUnPaid();

    @Query("select b from Booking b where b.status = 3")
    List<Booking> getAllBookingCancel();
}
