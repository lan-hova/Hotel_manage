/**
 * 
 */
package com.fpoly.repositories.imp;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fpoly.entities.Booking;
import com.fpoly.repositories.irepo.IBookingService;
import com.fpoly.repositories.repo.BookingRepository;

/**
 *
 * @author trucnv
 *
 */
@Service
public class IBookingServiceImp implements IBookingService {

	@Autowired
	private BookingRepository bookingRepo;

	@Override
	public Iterable<Booking> findAll() {
		return bookingRepo.findAll();
	}

	@Override
	public Optional<Booking> findById(Integer id) {
		return bookingRepo.findById(id);
	}

	@Override
	public Booking save(Booking t) {
		return bookingRepo.save(t);
	}

	@Override
	public void remove(Integer id) {
		bookingRepo.deleteById(id);
	}

	@Override
	public List<Booking> findByStatusAndPaymentStatus(Integer status, Integer paymentStatus) {
		return bookingRepo.findByStatusAndPaymentStatus(status, paymentStatus);
	}

	@Override
	public List<Booking> getAllBookingPaid() {
		return bookingRepo.getAllBookingPaid();
	}

	@Override
	public List<Booking> getAllBookingUnPaid() {
		return bookingRepo.getAllBookingUnPaid();
	}

	@Override
	public List<Booking> getAllBookingCancel() {
		return bookingRepo.getAllBookingCancel();
	}
}
