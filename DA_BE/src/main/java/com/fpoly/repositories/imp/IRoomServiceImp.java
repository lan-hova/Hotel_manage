/**
 * 
 */
package com.fpoly.repositories.imp;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fpoly.entities.Rooms;
import com.fpoly.repositories.irepo.IRoomService;
import com.fpoly.repositories.repo.RoomRepository;

/**
 *
 * @author trucnv
 *
 */
@Service
public class IRoomServiceImp implements IRoomService {

	@Autowired
	private RoomRepository roomRepo;

	@Override
	public Iterable<Rooms> findAll() {
		return roomRepo.findAll();
	}

	@Override
	public Optional<Rooms> findById(Integer id) {
		return roomRepo.findById(id);
	}

	@Override
	public Rooms save(Rooms t) {
		return roomRepo.save(t);
	}

	@Override
	public void remove(Integer id) {
		roomRepo.deleteById(id);
	}

}
