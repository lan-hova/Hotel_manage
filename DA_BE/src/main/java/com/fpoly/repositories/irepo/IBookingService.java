/**
 * 
 */
package com.fpoly.repositories.irepo;

import org.springframework.stereotype.Service;

import com.fpoly.entities.Booking;

import java.util.List;


/**
 *
 * @author trucnv 
 *
 */
@Service
public interface IBookingService extends IGeneralService<Booking>{
    List<Booking> findByStatusAndPaymentStatus(Integer status, Integer paymentStatus);
    List<Booking> getAllBookingPaid();
    List<Booking> getAllBookingUnPaid();
    List<Booking> getAllBookingCancel();
}
